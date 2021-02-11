000100070317     F**********************************************************************    000200040623     F*�F i l e s                                                               000300040623     F**********************************************************************    000400040623     FPROORDS   O    E             DISK                                         000500040623     F*                                                                         000600040623     FCONHDR    if   e           k disk                                         000700040623     FCONDTL    if   e           k disk                                         000800040623     F*�                                                                        000900040623     Fxreport   o    e             printer oflind(*in01)                        001000040623                                                                                001100040623     D**********************************************************************    001200040623     C**********************************************************************    001300040624     C                   MOVEL     P#PROD        X#PROD           20            001400040624     C     *loval        SETLL     CONHDRR                            2020      001500040623                                                                                001600040624     C                   read      CONHDRR                              2020    001700040623                                                                                001800040624     C* For each Contract record                                                001900040623     C                   dow       *in20 = *off                                 002000040623                                                                                002100040624     C     XWSTAT        ifne      'XX'                                         002200040624     C     dtlkey        setll     CONDTLR                            2121      002300040624                                                                                002400040624     C     dtlkey        reade     CONDTLR                              2121    002500040624     C                   dow       *in21 = *off                                 002600040624     C                   exsr      zprint                                       002700040624     C                   exsr      $update                                      002800040624     C     dtlkey        reade     CONDTLR                              2121    002900040624     C                   enddo                                                  003000040624     c                   endif                                                  003100040623                                                                                003200040623     C     NXTXRF        TAG                                                    003300040623                                                                                003400040624     C                   read      CONHDRR                              2020    003500040623                                                                                003600040624     C* End: For each Contract record                                           003700040623     C                   ENDDO                                                  003800040623                                                                                003900040623     C* Perform Termination Routines                                            004000040623     C                   if        isttim = *on                                 004100040623     C                   eval      eor = *on                                    004200040623     C                   exsr      zprint                                       004300040623     C                   endif                                                  004400040623                                                                                004500040623     C                   eval      *inlr = *on                                  004600040623     C                   return                                                 004700040623     C**********************************************************************    004800040623     C* L o g i c a l   E n d   O f   P r o g r a m                             004900040623     C**********************************************************************    005000040623                                                                                005100040623     C     $UPDAT        BEGSR                                                  005200040623     C**********************************************************************    005300040624     C* Subroutine: Write Profiled Orders File                                  005400040623     C**********************************************************************    005500040623     C                   MOVEL     LT(NR)        WHFNAM                         005600040623                                                                                005700040624     C                   WRITE     PROORDR                                      005800040623                                                                                005900040623     C                   ENDSR                                                  006000040623     C**********************************************************************    006100040623                                                                                006200040623     C**********************************************************************    006300040623     C     zprint        begsr                                                  006400040623     C**********************************************************************    006500040623     C*�Subroutine: Print a Report Line                                         006600040623     C**********************************************************************    006700040623     C*�If 1st time through then write out initial headings                     006800040623     C                   if        isttim <> *on                                006900040623     C                   write     rpthdr                               70      007000040623     C                   eval      isttim = *on                                 007100040623     C                   eval      lines = 4                                    007200040623     C                   eval      d#text = shd128                              007300040623     C                   write     rptdtl                               70      007400040623     C                   eval      d#text = *blanks                             007500040623     C                   write     rptdtl                               70      007600040623     C                   endif                                                  007700040623                                                                                007800040623     C*�Write detail line if not end of report                                  007900040623     C                   if        eor <> *on                                   008000040623     C                   eval      %subst(d#text:1:10) = s#mbr                  008100040623     C                   eval      %subst(d#text:12:10) = s#file                008200040623     C                   eval      %subst(d#text:23:10) = s#lib                 008300040623     C                   write     rptdtl                               70      008400040623     C                   eval      lines = lines + 1                            008500040623     C                   endif                                                  008600040623                                                                                008700040623     C*�Write out headings on overflow                                          008800040623     C                   if        *in01                                        008900040623     C                   write     rpthdr                               70      009000040623     C                   eval      *in01 = *off                                 009100040623     C                   eval      lines = 4                                    009200040623     C                   eval      d#text = shd128                              009300040623     C                   write     rptdtl                               70      009400040623     C                   eval      d#text = *blanks                             009500040623     C                   write     rptdtl                               70      009600040623     C                   endif                                                  009700040623                                                                                009800040623     C*�If end of report then write out eor message                             009900040623     C                   if        eor = *on                                    010000040623     C                   eval      lines = lines + 1                            010100040623     C                   write     rptend                               70      010200040623     C                   endif                                                  010300040623                                                                                010400040623     C                   endsr                                                  010500040623     C**********************************************************************    010600040623                                                                                010700040623     C**********************************************************************    010800040623     C     *INZSR        BEGSR                                                  010900040623     C**********************************************************************    011000040623     C* Subroutine: Initialisation Routines                                     011100040623     C**********************************************************************    011200040623                                                                                011300040623     C                   ENDSR                                                  011400040623     C**********************************************************************    011500040623                                                                                011600040623     C**********************************************************************    011700040623     C*�N o n - E x e c u t a b l e   C o d e                                   011800040623     C**********************************************************************    011900040623     C     *ENTRY        PLIST                                                  012000040624     C                   PARM                    P#PROD           20            012100040623                                                                                012200040624     C* Condtl                                                                  012300040624     C     dtlkey        klist                                                  012400040624     C                   kfld                    xwordn                         012500040624     C                   kfld                    x#prod                         012600040623     C**********************************************************************    