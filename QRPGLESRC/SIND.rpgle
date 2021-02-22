000100100713     H*�--------------------------------------------------------------------    
000200100713     H*�COPYRIGHT DATABOROUGH LTD 2010                                          
000300100713     H*�--------------------------------------------------------------------    
000400100713     H debug(*yes) copyright('Databorough Ltd. 2010') datedit(*dmy)             
000500100713     H option(*srcstmt:*nodebugio:*showcpy)                                     
000600100713     F**********************************************************************    
000700100713     F*�F i l e s                                                               
000800100713     F**********************************************************************    
000900100714     Fstkgrp2   if   e           k disk                                         
001000100714     Fstkgrp3   if   e           k disk                                         
001100100714     Ftrnhstl4  if   e           k disk                                         
001200100713     Fqsysprt   o    f  132        printer oflind(*INOF)                        
001300100713                                                                                
001400100713     D**********************************************************************    
001500100713     D*�D e f i n i t i o n s                                                   
001600100713     D**********************************************************************    
001700100714     D grp3count       s              7p 0                                      
001800100714     D trnhstcount     s              7p 0                                      
001900100713     D tyme            s              6s 0                                      
002000100713     D today           s              8s 0                                      
002100100713                                                                                
002200100713                                                                                
002300100713     C**********************************************************************    
002400100713     C*�M a i n l i n e   C o d e                                               
002500100713     C**********************************************************************    
002600100713      /free                                                                     
002700100713        *inof = *on;                                                            
002800100713                                                                                
002900100714       //�For each STKGRP2 record                                               
003000100714       setll *loval stkgrp2r;                                                   
003100100714       read(e) stkgrp2r;                                                        
003200100714       dow not %eof(stkgrp2);                                                   
003300100714                                                                                
003400100714       trnhstcount = *zeros;                                                    
003500100714       grp3count = *zeros;                                                      
003501110914       //grp4count = *zeros;                                                    
003600100714                                                                                
003700100714       //�Count TRNHST records                                                  
003800100714           setll TRNHSTK trnhstr;                                               
003900100714           reade(e) TRNHSTK trnhstr;                                            
004000100714           dow not %eof(trnhstl4) and not %error;                               
004100100714               trnhstcount = trnhstcount + 1;                                   
004200100714               reade(e) TRNHSTK trnhstr;                                        
004300100714           enddo;                                                               
004400100714                                                                                
004500100714       //�Count STKGRP3 records                                                 
004600100714           setll STKGRPK stkgrp3r;                                              
004700100714           reade(e) STKGRPK stkgrp3r;                                           
004800100714           dow not %eof(stkgrp3) and not %error;                                
004900100714               grp3count = grp3count + 1;                                       
005000100714               reade(e) STKGRPK stkgrp3r;                                       
005100100714           enddo;                                                               
005200100714                                                                                
005300100714       //�Output totals for stock group 2  record                               
005400100714          if *inof;                                                             
005500100714             except headings;                                                   
005600100714             *inof = *off;                                                      
005601110914          // except footer;                                                     
005602110914          // *inoa = *off;                                                      
005700100714          endif;                                                                
005800100714                                                                                
005900100714          except totals;                                                        
006000100714                                                                                
006100100714       read(e) stkgrp2r;                                                        
006200100714       enddo;                                                                   
006300100714                                                                                
006400100713       //�Terminate program and exit                                            
006500100713       *inlr = *on;                                                             
006600100713       return;                                                                  
006700100713      /end-free                                                                 
006800100713     C**********************************************************************    
006900100713     C*�* I N Z S R                                                             
007000100713     C**********************************************************************    
007100100713     C     *inzsr        begsr                                                  
007200100713     C                   time                    tyme                           
007300100713     C                   z-add     *date         today                          
007400100714     C     TRNHSTK       klist                                                  
007500100714     C                   kfld                    xwagcd                         
007600100714     C                   kfld                    xwahcd                         
007700100714     C     STKGRPK       klist                                                  
007800100714     C                   kfld                    xwagcd                         
007900100714     C                   kfld                    xwahcd                         
008000100713     C                   endsr                                                  
008100100713     Oqsysprt   e            headings       1 01                                
008200100713     O                                           10 'X-Analysis'                
008300100714     O                                           60 'Audit log for file:'       
008400100714     O                                           68 'STKGRP2'                   
008500100713     O                                          132 'Databorough LTD.'          
008600100713     O          e            headings       1                                   
008700100913     O                                           10 'ZAUDSTKGP2'                
008800100713     O                       tyme               120 '  :  :  '                  
008900100713     O                       today              132 '  /  /    '                
009000100713     O          e            headings       2                                   
009100100713     O                                          127 'Page:'                     
009200100713     O                       page          z    132                             
009300100713     O          e            headings       1                                   
009400100714     O                                           60 'TRNHST'                    
009500100714     O                                           75 'STKGRP3'                   
009600100713     O          e            headings       2                                   
009700100713     O                                           60 'Records'                   
009800100713     O                                           75 'Records'                   
009900100714     O          e            totals         2                                   
010000100714     O                       xwagcd               4                             
010100100714     O                       xwahcd               8                             
010200100714     O                       xwiwtx              30                             
010300100714     O                       trnhstcount   1     60                             
010400100714     O                       grp3count     1     75                             
