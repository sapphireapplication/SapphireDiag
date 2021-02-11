000100100713     H*�--------------------------------------------------------------------    
000200100713     H*�COPYRIGHT DATABOROUGH LTD 2010                                          
000300100713     H*�--------------------------------------------------------------------    
000400100713     H debug(*yes) copyright('Databorough Ltd. 2010') datedit(*dmy)             
000500100713     H option(*srcstmt:*nodebugio:*showcpy)                                     
000600100713     F**********************************************************************    
000700100713     F*�F i l e s                                                               
000800100713     F**********************************************************************    
000900100714     Fstkgrp3   if   e           k disk                                         
001000100714     Ftrnhstl4  if   e           k disk                                         
001100100713     Fqsysprt   o    f  132        printer oflind(*INOF)                        
001200100713                                                                                
001300100713     D**********************************************************************    
001400100713     D*�D e f i n i t i o n s                                                   
001500100713     D**********************************************************************    
001600100714     D trnhstcount     s              7p 0                                      
001700100713     D tyme            s              6s 0                                      
001800100713     D today           s              8s 0                                      
001900100713                                                                                
002000100713     C**********************************************************************    
002100100713     C*�M a i n l i n e   C o d e                                               
002200100713xxxxxC**********************************************************************    
002300100713      /free                                                                     
002400100713        *inof = *on;                                                            
002500100714                                                                                
002600100714       //�For each STKGRP3 record                                               
002700100714       setll *loval stkgrp3r;                                                   
002800100714       read(e) stkgrp3r;                                                        
002900100714       dow not %eof(stkgrp3);                                                   
003000100714                                                                                
003100100714       trnhstcount = *zeros;                                                    
003101110914       //trnhstcnt = *zeros;                                                    
003200100714                                                                                
003300100714       //�Count TRNHST records                                                  
003400100714           setll TRNHSTK trnhstr;                                               
003500100714           reade(e) TRNHSTK trnhstr;                                            
003600100714           dow not %eof(trnhstl4) and not %error;                               
003700100714               trnhstcount = trnhstcount + 1;                                   
003800100714               reade(e) TRNHSTK  trnhstr;                                       
003900100714           enddo;                                                               
004000100714                                                                                
004100100714       //�Output totals for stock group 3  record                               
004200100714          if *inof;                                                             
004300100714             except headings;                                                   
004400100714             *inof = *off;                                                      
004401110914          // *inoa = *off;                                                      
004500100714          endif;                                                                
004600100714                                                                                
004700100714          except totals;                                                        
004800100714                                                                                
004900100714       read(e) stkgrp3r;                                                        
005000100714       enddo;                                                                   
005100100714                                                                                
005200100713       //�Terminate program and exit                                            
005300100713       *inlr = *on;                                                             
005400100713       return;                                                                  
005500100713      /end-free                                                                 
005600100713     C**********************************************************************    
005700100713     C*�* I N Z S R                                                             
005800100713     C**********************************************************************    
005900100713     C     *inzsr        begsr                                                  
006000100713     C                   time                    tyme                           
006100100713     C                   z-add     *date         today                          
006200100714     C     TRNHSTK       klist                                                  
006300100714     C                   kfld                    xwagcd                         
006400100714     C                   kfld                    xwahcd                         
006500100714     C                   kfld                    xwaicd                         
006600100713     C                   endsr                                                  
006700100713     Oqsysprt   e            headings       1 01                                
006800100713     O                                           10 'X-Analysis'                
006900100714     O                                           60 'Audit log for file:'       
007000100714     O                                           68 'STKGRP3'                   
007100100713     O                                          132 'Databorough LTD.'          
007200100713     O          e            headings       1                                   
007300100913     O                                           10 'ZAUDSTKGP3'                
007400100713     O                       tyme               120 '  :  :  '                  
007500100713     O                       today              132 '  /  /    '                
007600100713     O          e            headings       2                                   
007700100713     O                                          127 'Page:'                     
007800100713     O                       page          z    132                             
007900100713     O          e            headings       1                                   
008000100714     O                                           60 'TRNHST'                    
008100100713     O          e            headings       2                                   
008200100713     O                                           60 'Records'                   
008300100714     O          e            totals         2                                   
008400100714     O                       xwagcd               4                             
008500100714     O                       xwahcd               8                             
008600100714     O                       xwaicd              12                             
008700100714     O                       xwiwtx              30                             
008800100714     O                       trnhstcount   1     60                             
